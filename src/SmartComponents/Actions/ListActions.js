import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Ansible,
    Battery,
    Main,
    Pagination,
    SimpleTableFilter,
    SortDirection,
    Table,
    PageHeader,
    PageHeaderTitle
} from '@red-hat-insights/insights-frontend-components';
import {
    Grid,
    GridItem,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { sortBy } from 'lodash';
import TimeAgo from 'react-timeago';
import Crumbs from '../../PresentationalComponents/Crumbs/Crumbs.js';
import './_actions.scss';

class ListActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cols: [ 'Type', 'Name', 'Reported' ],
            unfilteredRows: [],
            rows: [],
            rule: {
                description: ''
            },
            sortBy: {},
            itemsPerPage: 10,
            page: 1
        };
        this.onSortChange = this.onSortChange.bind(this);
        this.toggleCol = this.toggleCol.bind(this);
        this.limitRows = this.limitRows.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
        this.parseProductCode = this.parseProductCode.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        const response = this.props.AdvisorStore.mediumRiskRules;
        document.getElementById('root').classList.add('actions__list');

        let rule = response.rules.find(obj => {
            return obj.rule_id === this.props.match.params.id;
        });
        this.setState({ rule });

        const response2 = this.props.AdvisorStore.impactedSystems;
        let rows = [];
        for (let i = 0;i < response2.length;i++) {
            rows.push(
                { cells: [
                    this.parseProductCode(response2[i].product_code),
                    (response2[i].hostname === '' ? response2[i].system_id : response2[i].hostname),
                    <TimeAgo key={ i } date={ response2[i].created_at } />
                ]}
            );
        }

        this.setState({ unfilteredRows: rows });
        this.setState({ rows });
    }

    componentDidUnMount() {
        document.getElementById('root').classList.remove('actions__list');
    }

    onSearch(value) {
        const lowerCaseValue = value.toLowerCase();
        const rows = this.state.unfilteredRows.filter(row =>  row.cells[0].toLowerCase().indexOf(lowerCaseValue) !== -1 ||
                                                              row.cells[1].toLowerCase().indexOf(lowerCaseValue) !== -1);
        this.setState({
            ...this.state,
            rows
        });
    }

    parseProductCode(productCode) {
        let productName = '';
        switch (productCode) {
            case 'rhel':
                productName = 'RHEL Server';
                break;
            default:
                productName = 'Undefined';
        }

        return productName;
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

        switch (this.state.rows.length === 0) {
            case true:
                this.setState({
                    ...this.state,
                    rows: [{ cells: [ 'No Results' ]}]
                });
                break;
            default:
                return this.state.rows.slice(firstIndex, lastIndex);
        }
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

    render() {
        const rows = this.limitRows();

        return (
            <React.Fragment>
                <Crumbs current={ this.state.rule.description } />
                <PageHeader>
                    <PageHeaderTitle title={ this.state.rule.description }/>
                </PageHeader>
                <Main className='actions__list'>
                    <Stack gutter='md'>
                        <StackItem>
                            <Grid gutter='md'>
                                <GridItem md={ 8 } sm={ 12 }>
                                    <div className='actions__description' dangerouslySetInnerHTML={ { __html: this.state.rule.summary_html } }/>
                                </GridItem>
                                <GridItem md={ 4 } sm={ 12 }>
                                    <Grid gutter='sm' className='actions__detail'>
                                        <GridItem sm={ 12 } md={ 12 }> <Ansible unsupported = { this.state.rule.ansible }/> </GridItem>
                                        <GridItem sm={ 8 } md={ 12 }>
                                            <Grid className='ins-l-icon-group__vertical' sm={ 4 } md={ 12 }>
                                                <GridItem> <Battery label='Impact' severity={ this.state.rule.rec_impact }/> </GridItem>
                                                <GridItem> <Battery label='Likelihood' severity={ this.state.rule.rec_likelihood }/> </GridItem>
                                                <GridItem> <Battery label='Total Risk' severity={ this.state.rule.resolution_risk }/> </GridItem>
                                            </Grid>
                                        </GridItem>
                                        <GridItem sm={ 4 } md={ 12 }>
                                            <Battery label='Risk Of Change' severity={ 3 }/>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </StackItem>
                        <StackItem>
                            <SimpleTableFilter onFilterChange={ this.onSearch } placeholder='Find a system' buttonTitle='Search' />
                        </StackItem>
                        <StackItem>
                            <Table
                                className='impacted-systems-table'
                                onItemSelect={ this.toggleCol }
                                hasCheckbox={ true }
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

ListActions.propTypes = {
    match: PropTypes.any,
    AdvisorStore: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
    ...state,
    ...ownProps
});

export default withRouter(
    connect(
        mapStateToProps
    )(ListActions)
);

