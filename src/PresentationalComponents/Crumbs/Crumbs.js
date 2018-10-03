import React, { Component } from 'react';
import { AngleRightIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './crumbs.scss';

/**
 * This component outputs breadcrumbs based on the current URL.
 */

class Crumbs extends Component {
    constructor(props) {
        super(props);
        this.buildItems = this.buildItems.bind(this);
        this.getActionTitle = this.getActionTitle.bind(this);
    }

    buildItems() {
        let path = document.location.pathname.split('/');
        let trimmedPath = path.slice((path.indexOf('advisor') + 1), path.length - 1);
        let crumbs = [];
        let navigate = '';

        trimmedPath.map((value) => {
            navigate += `/${value}`;
            crumbs.push({
                title: (value.indexOf('-') > 0 ? this.getActionTitle(value) : value),
                navigate
            });
        });

        return crumbs;
    }

    getActionTitle(value) {
        let title = value.replace('-', ' ');
        title += ' Actions';
        return title;
    }

    render() {
        const items = this.buildItems();
        return (
            <React.Fragment>
                {
                    items.length > 0 && <ol className='ins-breadcrumbs' widget-type='InsightsBreadcrumbs'>
                        { items.map((link) => (
                            <li key={ link.navigate }>
                                <Link to={ link.navigate }>{ link.title }</Link>
                                <AngleRightIcon />
                            </li>
                        )) }
                        { this.props.current &&
                    <li className="ins-active">
                        <span>{ this.props.current }</span>
                    </li>
                        }
                    </ol>
                }
            </React.Fragment>
        );
    };
};

Crumbs.propTypes = {
    current: PropTypes.string.isRequired
};

export default Crumbs;
