export * from './environment';
export * from './api-url';


export function calculateAge(birthday) {

  try {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const result = Math.abs(ageDate.getUTCFullYear() - 1970);
  
    return isNaN(result) ? 0 : result    

  } catch (error) {
    return 0;    
  }

}