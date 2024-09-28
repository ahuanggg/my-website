const dadJoke = async (url) => {
    try {
        const headers = {
            'Accept': 'application/json',
            'User-Agent': 'my website https://github.com/ahuanggg/my-website',
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`I have ran out of jokes :(... Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error when fetching data: ', error);
        return 'Error fetching data';
    }
};

export default dadJoke;
