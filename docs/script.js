document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const syncBtn = document.getElementById('syncBtn');
  const asyncBtn = document.getElementById('asyncBtn');
  const fetchBtn = document.getElementById('fetchBtn');
  
  if (syncBtn) {
      console.log("Button with ID 'syncBtn' found.");
      syncBtn.addEventListener('click', fetchDataSync);
  } else {
      console.error("Button with ID 'syncBtn' not found.");
  }

  if (asyncBtn) {
      console.log("Button with ID 'asyncBtn' found.");
      asyncBtn.addEventListener('click', fetchDataAsync);
  } else {
      console.error("Button with ID 'asyncBtn' not found.");
  }

  if (fetchBtn) {
      console.log("Button with ID 'fetchBtn' found.");
      fetchBtn.addEventListener('click', fetchDataWithPromises);
  } else {
      console.error("Button with ID 'fetchBtn' not found.");
  }
});

function fetchDataSync() {
  console.log("--START OF SYNCHRONOUS PROGRAMMING--");
  console.log('fetchDataSync function called');
  const output = document.getElementById('details');
  output.innerHTML = ''; // Clear previous results

  try {
      // Step 1: Fetch reference.json to get the location of data1.json
      console.log('Fetching reference.json');
      const referenceData = makeSynchronousRequest('data/reference.json');
      console.log('reference.json fetched:', referenceData);
      const data1Location = referenceData.data_location;
      console.log('Location of data1.json:', data1Location);

      // Step 2: Fetch data1.json using the location from reference.json
      console.log(`Fetching ${data1Location}`);
      const data1 = makeSynchronousRequest(`data/${data1Location}`);
      console.log(`${data1Location} fetched:`, data1);
      const data2Location = data1.data_location;
      console.log('Location of data2.json:', data2Location);
      output.innerHTML += formatData(data1.data);

      // Step 3: Fetch data2.json using the location from data1.json
      console.log(`Fetching ${data2Location}`);
      const data2 = makeSynchronousRequest(`data/${data2Location}`);
      console.log(`${data2Location} fetched:`, data2);
      output.innerHTML += formatData(data2.data);

      // Step 4: Fetch data3.json directly (as its name is known)
      console.log('Fetching data3.json');
      const data3 = makeSynchronousRequest('data/data3.json');
      console.log('data3.json fetched:', data3);
      output.innerHTML += formatData(data3.data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Helper function to make a synchronous XMLHttpRequest
function makeSynchronousRequest(url) {
  console.log(`Making synchronous request to ${url}`);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);  // false makes the request synchronous
  xhr.send();

  if (xhr.status === 200) {
      console.log(`Request to ${url} successful`);
      return JSON.parse(xhr.responseText);
  } else {
      console.error(`Failed to fetch ${url}: ${xhr.status}`);
      throw new Error(`Failed to fetch ${url}: ${xhr.status}`);
  }
}

// Helper function to format and display data
function formatData(data) {
  console.log('Formatting data:', data);
  let result = '<table border="1"><tr><th>First Name</th><th>Last Name</th><th>ID</th></tr>';
  
  data.forEach(student => {
      const [firstName, lastName] = student.name.split(' ');
      result += `<tr><td>${firstName}</td><td>${lastName}</td><td>${student.id}</td></tr>`;
  });
  
  result += '</table>';
  return result;
}

// Asynchronous function to fetch data using traditional callbacks
function fetchDataAsync() {
  console.log("--START OF ASYNCHRONOUS PROGRAMMING--");
  console.log('fetchDataAsync function called');
  const output = document.getElementById('details');
  output.innerHTML = ''; // Clear previous results

  // Step 1: Fetch reference.json to get the location of data1.json
  console.log('Fetching reference.json');
  fetchData('data/reference.json', (error, referenceData) => {
    if (error) {
      console.error('Error fetching reference.json:', error);
      return;
    }
    console.log('reference.json fetched:', referenceData);
    const data1Location = referenceData.data_location;
    console.log('Location of data1.json:', data1Location);

    // Step 2: Fetch data1.json using the location from reference.json
    console.log(`Fetching ${data1Location}`);
    fetchData(`data/${data1Location}`, (error, data1) => {
      if (error) {
        console.error(`Error fetching ${data1Location}:`, error);
        return;
      }
      console.log(`${data1Location} fetched:`, data1);
      const data2Location = data1.data_location;
      console.log('Location of data2.json:', data2Location);
      output.innerHTML += formatData(data1.data);

      // Step 3: Fetch data2.json using the location from data1.json
      console.log(`Fetching ${data2Location}`);
      fetchData(`data/${data2Location}`, (error, data2) => {
        if (error) {
          console.error(`Error fetching ${data2Location}:`, error);
          return;
        }
        console.log(`${data2Location} fetched:`, data2);
        output.innerHTML += formatData(data2.data);

        // Step 4: Fetch data3.json directly
        console.log('Fetching data3.json');
        fetchData('data/data3.json', (error, data3) => {
          if (error) {
            console.error('Error fetching data3.json:', error);
            return;
          }
          console.log('data3.json fetched:', data3);
          output.innerHTML += formatData(data3.data);
        });
      });
    });
  });
}

// Helper function to make an asynchronous XMLHttpRequest using callbacks
function fetchData(url, callback) {
  console.log(`Making asynchronous request to ${url}`);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(`Request to ${url} successful`);
      callback(null, JSON.parse(xhr.responseText));
    } else {
      console.error(`Failed to fetch ${url}: ${xhr.status}`);
      callback(new Error(`Failed to fetch ${url}: ${xhr.status}`));
    }
  };
  xhr.onerror = () => {
    console.error(`Network error while fetching ${url}`);
    callback(new Error('Network error'));
  };
  xhr.send();
}

// Asynchronous function to fetch data using fetch and promises
function fetchDataWithPromises() {
  console.log("--START OF FETCH + PROMISES PROGRAMMING--");
  console.log('fetchDataWithPromises function called');
  const output = document.getElementById('details');
  output.innerHTML = ''; // Clear previous results

  // Step 1: Fetch reference.json to get the location of data1.json
  console.log('Fetching reference.json');
  fetch('data/reference.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch reference.json: ${response.status}`);
      }
      return response.json();
    })
    .then(referenceData => {
      console.log('reference.json fetched:', referenceData);
      const data1Location = referenceData.data_location;
      console.log('Location of data1.json:', data1Location);

      // Step 2: Fetch data1.json using the location from reference.json
      console.log(`Fetching ${data1Location}`);
      return fetch(`data/${data1Location}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data1.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data1 => {
      console.log('data1.json fetched:', data1);
      const data2Location = data1.data_location;
      console.log('Location of data2.json:', data2Location);
      output.innerHTML += formatData(data1.data);

      // Step 3: Fetch data2.json using the location from data1.json
      console.log(`Fetching ${data2Location}`);
      return fetch(`data/${data2Location}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data2.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data2 => {
      console.log('data2.json fetched:', data2);
      output.innerHTML += formatData(data2.data);

      // Step 4: Fetch data3.json directly
      console.log('Fetching data3.json');
      return fetch('data/data3.json');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data3.json: ${response.status}`);
      }
      return response.json();
    })
    .then(data3 => {
      console.log('data3.json fetched:', data3);
      output.innerHTML += formatData(data3.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}