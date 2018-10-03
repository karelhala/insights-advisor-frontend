import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';
import {
    Ansible,
    Battery,
    PageHeader,
    PageHeaderTitle,
    Pagination,
    SortDirection,
    Table,
    Main
} from '@red-hat-insights/insights-frontend-components';
import { Stack, StackItem } from '@patternfly/react-core';
import Crumbs from '../../PresentationalComponents/Crumbs/Crumbs.js';
import './_actions.scss';

class ViewActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: '',
            cols: [
                'Rule',
                'Likelihood',
                'Impact',
                'Total Risk',
                'Systems',
                'Ansible'
            ],
            rows: [],
            sortBy: {},
            itemsPerPage: 10,
            page: 1,
            things: []
        };
        this.onSortChange = this.onSortChange.bind(this);
        this.toggleCol = this.toggleCol.bind(this);
        this.limitRows = this.limitRows.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
    }

    componentDidMount() {
        document.getElementById('root').classList.add('actions__view');
        const response = this.props.AdvisorStore.mediumRiskRules;
        this.setState({ summary: response.summary });

        let rows = [];
        if (response.rules) {
            for (let i = 0; i < response.rules.length; i++) {
                rows.push({
                    cells: [
                        <Link
                            key={ i }
                            to={ `/actions/${this.props.match.params.type }/${
                                response.rules[i].rule_id
                            }` }
                        >
                            { response.rules[i].description }
                        </Link>,
                        <Battery
                            key={ i }
                            label='Likelihood'
                            labelHidden
                            severity={ response.rules[i].rec_likelihood }
                        />,
                        <Battery
                            key={ i }
                            label='Impact'
                            labelHidden
                            severity={ response.rules[i].rec_impact }
                        />,
                        <Battery
                            key={ i }
                            label='Total Risk'
                            labelHidden
                            severity={ response.rules[i].resolution_risk }
                        />,
                        <div key={ i }>{ response.rules[i].hitCount }</div>,
                        <Ansible
                            key={ i }
                            unsupported={ response.rules[i].ansible === 1 ? true : false }
                        />
                    ]
                });
            }
        }

        this.setState({ rows });
    }

    toggleCol(_event, key, selected) {
        let { rows, page, itemsPerPage } = this.state;
        const firstIndex = page === 1 ? 0 : page * itemsPerPage - itemsPerPage;
        rows[firstIndex + key].selected = selected;
        this.setState({
            ...this.state,
            rows
        });
    }

    onSortChange(_event, key, direction) {
        const sortedRows = sortBy(this.state.rows, [ e => e.cells[key] ]);
        this.setState({
            ...this.state,
            rows: SortDirection.up === direction ? sortedRows : sortedRows.reverse(),
            sortBy: {
                index: key,
                direction
            }
        });
    }

    limitRows() {
        const { page, itemsPerPage } = this.state;
        const numberOfItems = this.state.rows.length;
        const lastPage = Math.ceil(numberOfItems / itemsPerPage);
        const lastIndex = page === lastPage ? numberOfItems : page * itemsPerPage;
        const firstIndex = page === 1 ? 0 : page * itemsPerPage - itemsPerPage;
        return this.state.rows.slice(firstIndex, lastIndex);
    }

    setPage(page) {
        this.setState({
            ...this.state,
            page
        });
    }

    setPerPage(amount) {
        this.setState({
            ...this.state,
            itemsPerPage: amount
        });
    }

    parseUrlTitle(title = '') {
        const parsedTitle = title.split('-');
        return parsedTitle.length > 1 ? `${parsedTitle[0]} ${parsedTitle[1]} Actions` : `${parsedTitle}`;
    }

    render() {
        const rows = this.limitRows();
        return (
            <React.Fragment>
                <Crumbs current={ this.parseUrlTitle(this.props.match.params.type) } />
                <PageHeader>
                    <PageHeaderTitle
                        className='actions__view--title'
                        title={ this.parseUrlTitle(this.props.match.params.type) }
                    />
                </PageHeader>
                <Main>
                    <Stack gutter='md'>
                        <StackItem>
                            <p>{ this.state.summary }</p>
                        </StackItem>
                        <StackItem className='advisor-l-actions__filters'>
              Filters
                        </StackItem>
                        <StackItem className='advisor-l-actions__table'>
                            <Table
                                className='rules-table'
                                onItemSelect={ this.toggleCol }
                                hasCheckbox={ false }
                                header={ this.state.cols }
                                sortBy={ this.state.sortBy }
                                rows={ rows }
                                onSort={ this.onSortChange }
                                footer={
                                    <Pagination
                                        numberOfItems={ this.state.rows.length }
                                        onPerPageSelect={ this.setPerPage }
                                        page={ this.state.page }
                                        onSetPage={ this.setPage }
                                        itemsPerPage={ this.state.itemsPerPage }
                                    />
                                }
                            />
                        </StackItem>
                    </Stack>
                </Main>
            </React.Fragment>
        );
    }
}

ViewActions.propTypes = {
    match: PropTypes.any,
    AdvisorStore: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
    ...state,
    ...ownProps
});

export default withRouter(connect(mapStateToProps)(ViewActions));
