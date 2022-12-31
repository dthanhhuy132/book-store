import {createGlobalState} from 'react-hooks-global-state';
const initialState = {
   accessToken: '',
   currentUser: '',
   headerHeight: 40,
};

const {useGlobalState} = createGlobalState(initialState);

export default useGlobalState;
