export const formatDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    return formattedDate;
};

export const moneyFormat = (money: number) => {
    return money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/\./g, ',');
};
