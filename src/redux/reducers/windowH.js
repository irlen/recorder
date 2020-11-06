
const windowH = (state={windowH: 0},action)=>{
   switch(action.type){
    case 'SET_WH':
      return {windowH:action.windowH}
    default:
      return state
  }
}

export default windowH
