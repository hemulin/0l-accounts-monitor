export interface Account {
  accountAddress: string;
  friendlyName: string;
  coinValue: string | number;
  unlockedValue: string | number;
  isSlowWallet: boolean;
  isCW: boolean;
  isInValidatorSet: boolean;
  isValidator: boolean;
}


export interface TotalSums {
  libraBalanceSum: string;
  unlockedBalanceSum: string;
}


export interface FetchResponse<T> {
  data: { value: T };
  error: { value: any };
}


export interface ValidatorSetResponse {
  active_validators: Array<{ addr: string }>;
}


export interface AccountResourcesResponse {
  data: Array<{ type: string; data: any }>;
}

export interface ValidatorSetResponseType {
  type: string;
  data: ValidatorSetData;
}

export interface ValidatorSetData {
  active_validators: ValidatorInfo[];
  consensus_scheme: number;
  pending_active: any[]; // Adjust the type according to the actual structure
  pending_inactive: any[]; // Adjust the type according to the actual structure
  total_joining_power: string;
  total_voting_power: string;
}

export interface ValidatorInfo {
  addr: string;
  config: {
      consensus_pubkey: string;
      fullnode_addresses: string;
      network_addresses: string;
      validator_index: string;
  };
  voting_power: string;
}

export interface AccountResourceType {
  type: string;
  // Include other properties that might be in each account resource object
  data: any; // Replace 'any' with a more specific type if possible
}

export interface AccountResourcesResponseType {
  data: { value: ResourceItem[] };
  error: { value: any }; // Adjust based on the actual error structure
}

export interface ResourceItem {
  type: string;
  data: any; // Replace 'any' with a more specific type if possible
}


export interface FetchResourcesResponse {
  data: { value: ResourceItem[] };
  error: { value: any }; // Adjust based on the actual error structure
}
