import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectFootballTeamsState = (state: State): FootballTeamsState =>
  state[FootballTeamsStateSpecification.featureStateKey] as FootballTeamsState;

export const updateFootballTeamsState = (state: State, command: Spec<FootballTeamsState, never>): State =>
  update(state, {
    [FootballTeamsStateSpecification.featureStateKey]: command
  });

export interface FootballTeamsState {}

@NgSsmFeatureState({
  featureStateKey: FootballTeamsStateSpecification.featureStateKey,
  initialState: FootballTeamsStateSpecification.initialState
})
export class FootballTeamsStateSpecification {
  public static readonly featureStateKey = 'football-teams-state';
  public static readonly initialState: FootballTeamsState = {};
}
