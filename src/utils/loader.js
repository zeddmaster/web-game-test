

export const useLoaderToggler = (element) => {

    if(!element)
        console.error('Loader: element not found');

    function setLoaderVisible(visibility) {

        if(!element) return;

        if(!visibility)
            element.classList.add('hidden');
        else
            element.classList.remove('hidden');
    }


    return {
        setLoaderVisible,
    }

}