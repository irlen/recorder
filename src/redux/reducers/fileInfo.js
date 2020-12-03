import _ from 'lodash'

const fileInfo = (state={activeKey: null, deleteKey: null},action)=>{
    switch(action.type){
      case 'SET_ACTIVE_KEY':
        const curState1 = _.cloneDeep(state)
        const newState1 = Object.assign({},curState1,{activeKey:action.activeKey})
        return newState1
      case 'SET_DELETE_KEY':
        const curState2 = _.cloneDeep(state)
        const newState2 = Object.assign({},curState2,{deleteKey:action.deleteKey})
        return newState2
      default:
        return state
   }
 }
 
 export default fileInfo
 