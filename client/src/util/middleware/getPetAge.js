export function getPetAge(createdAt, lastUpdated) { 
    const createdAtDate = new Date(createdAt);
    const lastUpdatedDate = new Date(lastUpdated);

    const diffInMS = lastUpdatedDate.getTime() - createdAtDate.getTime();


    const diffInMinutes = Math.floor(diffInMS / (1000 * 60)); 

    const diffInHours = Math.floor(diffInMS / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));

    return {days: diffInDays, hours: diffInHours % 24, minutes: diffInMinutes & 60, lastUpdatedDate};
}