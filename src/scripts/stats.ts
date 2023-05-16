
const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

const url = "../metrics/relax/2023-05-14_2023-05-15.json";

fetch(url)
.then((response) => response.json())
.then((json) => {
    console.log(json);
});

const testElement = document.getElementById('test');
const testData = '';