let errorCodes = {
    404: "Not Found! Oh noes! Check your URL",
    500: "Ya sorry can't help you... the server is just borked",
    403: "You shall not pass! Unless you have creds. Then sure go ahead.",
    503: "Service is unavailable! The servers are all having a coffee break."
 }


async function fetchData(sourceURL, headers) {
    //* ask for a resource, and then do something with it when it resolves
    let resource = await fetch(sourceURL, headers).then(response => {
        if (response.status !== 200) {
            throw new Error(`Danger Will Robinson! Error ${response.status}: ${errorCodes[response.status]}`);
        }
        return response;
    });

    let dataset = await resource.json();
    return dataset.data;
}

async function postData(sourceURL) {

    return "You are using the postData API endpoint";
}


export { fetchData, postData };