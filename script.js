document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const syncBtn = document.getElementById('syncBtn');
  
  if (syncBtn) {
      console.log("Button with ID 'syncBtn' found.");
      syncBtn.addEventListener('click', fetchDataSync);
  } else {
      console.error("Button with ID 'syncBtn' not found.");
  }
});

function fetchDataSync() {
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