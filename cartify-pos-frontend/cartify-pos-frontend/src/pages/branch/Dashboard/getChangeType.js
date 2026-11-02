export const getChangeType=(growth)=>{
  if(growth>0) return "positive";
  if(growth<0) return "nagative";
  return "neutral"
}