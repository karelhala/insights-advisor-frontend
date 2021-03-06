import Immutable from 'seamless-immutable';
import * as ActionTypes from './AppConstants';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    mediumRiskRules: {},
    mediumRiskRulesFetchStatus: '',
    impactedSystems: [],
    impactedSystemsFetchStatus: '',
    rules: {},
    rulesFetchStatus: '',
    stats: {},
    statsFetchStatus: '',
    system: {},
    systemFetchStatus: '',
    systemtype: {},
    systemtypeFetchStatus: ''
});

export const AdvisorStore = (state = initialState, action) => {
    switch (action.type) {

        case `${ActionTypes.MEDIUM_RISK_RULES_FETCH}_PENDING`:
            return state.set('mediumRiskRulesFetchStatus', 'pending');
        case `${ActionTypes.MEDIUM_RISK_RULES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                mediumRiskRules: action.payload,
                mediumRiskRulesFetchStatus: 'fulfilled' });
        case `${ActionTypes.MEDIUM_RISK_RULES_FETCH}_REJECTED`:
            return state.set('mediumRiskRulesFetchStatus', 'rejected');

        case `${ActionTypes.IMPACTED_SYSTEMS_FETCH}_PENDING`:
            return state.set('impactedSystemsFetchStatus', 'pending');
        case `${ActionTypes.IMPACTED_SYSTEMS_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                impactedSystems: action.payload.resources,
                impactedSystemsFetchStatus: 'fulfilled' });
        case `${ActionTypes.IMPACTED_SYSTEMS_FETCH}_REJECTED`:
            return state.set('impactedSystemsFetchStatus', 'rejected');

        case `${ActionTypes.RULES_FETCH}_PENDING`:
            return state.set('rulesFetchStatus', 'pending');
        case `${ActionTypes.RULES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                rules: action.payload,
                rulesFetchStatus: 'fulfilled' });
        case `${ActionTypes.RULES_FETCH}_REJECTED`:
            return state.set('rulesFetchStatus', 'rejected');

        case `${ActionTypes.STATS_FETCH}_PENDING`:
            return state.set('statsFetchStatus', 'pending');
        case `${ActionTypes.STATS_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                stats: action.payload,
                statsFetchStatus: 'fulfilled' });
        case `${ActionTypes.STATS_FETCH}_REJECTED`:
            return state.set('statsFetchStatus', 'rejected');

        case `${ActionTypes.SYSTEM_FETCH}_PENDING`:
            return state.set('systemFetchStatus', 'pending');
        case `${ActionTypes.SYSTEM_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                system: action.payload,
                systemFetchStatus: 'fulfilled' });
        case `${ActionTypes.SYSTEM_FETCH}_REJECTED`:
            return state.set('systemFetchStatus', 'rejected');

        case `${ActionTypes.SYSTEMTYPE_FETCH}_PENDING`:
            return state.set('systemtypeFetchStatus', 'pending');
        case `${ActionTypes.SYSTEMTYPE_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                systemtype: action.payload,
                systemtypeFetchStatus: 'fulfilled' });
        case `${ActionTypes.SYSTEMTYPE_FETCH}_REJECTED`:
            return state.set('systemFetchStatus', 'rejected');

        default:
            return state;
    }
};
