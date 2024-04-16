const  formatTrailerSearch = (title: string) => {
    const formattedTitle = title.replace(/ /g, '+') + '+trailer';
    return formattedTitle;
}

export default formatTrailerSearch;