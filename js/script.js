// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburger.classList.toggle('toggle');
});

// Close menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('nav-active');
    hamburger.classList.remove('toggle');
  });
});

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('search-type')) {
    setupNationalParksPage();
  } else if (document.getElementById('mountain-select')) {
    setupMountainsPage();
  }
});

// National Parks Page Functions
document.addEventListener('DOMContentLoaded', () => {
  setupNationalParksPage();
});

function setupNationalParksPage() {
  const searchTypeSelect = document.getElementById('search-type');
  const locationFilter = document.getElementById('location-filter');
  const parkTypeFilter = document.getElementById('park-type-filter');
  const locationSelect = document.getElementById('location-select');
  const parkTypeSelect = document.getElementById('park-type-select');
  const searchButton = document.getElementById('search-button');
  const resultsDiv = document.getElementById('results');

  // Populate the location dropdown
  locationsArray.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });

  // Populate the park type dropdown
  parkTypesArray.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    parkTypeSelect.appendChild(option);
  });

  // Handle search type change
  searchTypeSelect.addEventListener('change', () => {
    if (searchTypeSelect.value === 'location') {
      locationFilter.style.display = 'block';
      parkTypeFilter.style.display = 'none';
    } else {
      locationFilter.style.display = 'none';
      parkTypeFilter.style.display = 'block';
    }
  });

  // Handle search button click
  searchButton.addEventListener('click', () => {
    resultsDiv.innerHTML = ''; // Clear previous results
    let filteredParks = [];
    if (searchTypeSelect.value === 'location') {
      const selectedLocation = locationSelect.value;
      if (selectedLocation === '') {
        alert('Please select a location.');
        return;
      }
      filteredParks = nationalParksArray.filter(park => park.State === selectedLocation);
    } else {
      const selectedType = parkTypeSelect.value;
      if (selectedType === '') {
        alert('Please select a park type.');
        return;
      }
      filteredParks = nationalParksArray.filter(park =>
        park.LocationName.toLowerCase().includes(selectedType.toLowerCase())
      );
    }
    displayParks(filteredParks);
  });

  // Display parks in the results div
  function displayParks(parks) {
    if (parks.length === 0) {
      resultsDiv.innerHTML = '<p>No parks found.</p>';
      return;
    }
    parks.forEach(park => {
      const parkDiv = document.createElement('div');
      parkDiv.classList.add('result-item');

      // Background image (Use a default image or based on park type)
      const resultBackground = document.createElement('img');
      resultBackground.classList.add('result-background');
      resultBackground.src = getParkImage(park);
      resultBackground.alt = park.LocationName;
      parkDiv.appendChild(resultBackground);

      // Content overlay
      const resultContent = document.createElement('div');
      resultContent.classList.add('result-content');

      const parkName = document.createElement('h3');
      parkName.textContent = park.LocationName;

      const parkAddress = document.createElement('p');
      parkAddress.textContent = `${park.Address}, ${park.City}, ${park.State} ${park.ZipCode}`;

      resultContent.appendChild(parkName);
      resultContent.appendChild(parkAddress);

      // Add link if "Visit" property exists
      if (park.Visit) {
        const visitLink = document.createElement('a');
        visitLink.href = park.Visit;
        visitLink.textContent = 'Visit Website';
        visitLink.target = '_blank';
        visitLink.classList.add('btn');
        resultContent.appendChild(visitLink);
      }

      parkDiv.appendChild(resultContent);
      resultsDiv.appendChild(parkDiv);
    });
  }

  // Function to get a park image (You can customize this)
  function getParkImage(park) {
    // For demonstration, return a default image
    return 'images/park-default.jpg';
    // Alternatively, you can map specific images to parks or park types
  }
}

// Mountains Page Functions
document.addEventListener('DOMContentLoaded', () => {
    setupMountainsPage();
  });
  
  function setupMountainsPage() {
    const mountainSelect = document.getElementById('mountain-select');
    const heroImage = document.getElementById('hero-image');
    const mountainNameElement = document.getElementById('mountain-name');
    const mountainDescElement = document.getElementById('mountain-desc');
    const mountainExtraDetailsDiv = document.getElementById('mountain-extra-details');
    const sunTimesDiv = document.getElementById('sun-times');
  
    // Populate the mountain dropdown
    mountainsArray.forEach(mountain => {
      const option = document.createElement('option');
      option.value = mountain.name;
      option.textContent = mountain.name;
      mountainSelect.appendChild(option);
    });
  
    // Handle mountain selection
    mountainSelect.addEventListener('change', () => {
      const selectedMountain = mountainsArray.find(
        mountain => mountain.name === mountainSelect.value
      );
      displayMountainDetails(selectedMountain);
    });
  
    // Display mountain details
    function displayMountainDetails(mountain) {
      if (!mountain) return;
  
      // Update the hero image source
      heroImage.src = mountain.img ? `images/${mountain.img}` : `images/default-mountain.jpg`;
  
      // Reset and reapply the zoom animation
      heroImage.style.animation = 'none';
      void heroImage.offsetWidth; // Trigger reflow to restart the animation
      heroImage.style.animation = '';
  
      // Update the mountain name and description
      mountainNameElement.textContent = mountain.name;
      mountainDescElement.textContent = mountain.desc;
  
      // Clear previous extra details and sun times
      mountainExtraDetailsDiv.innerHTML = '';
      sunTimesDiv.innerHTML = '';
  
      // Display elevation in the extra details section
      const elevationP = document.createElement('p');
      elevationP.textContent = `Elevation: ${mountain.elevation.toLocaleString()} ft`;
      mountainExtraDetailsDiv.appendChild(elevationP);
  
      // Fetch and display sunrise/sunset times
      getSunsetForMountain(mountain.coords.lat, mountain.coords.lng)
        .then(data => {
          const sunrise = data.results.sunrise;
          const sunset = data.results.sunset;
          const sunriseP = document.createElement('p');
          sunriseP.textContent = `Sunrise (UTC): ${sunrise}`;
          const sunsetP = document.createElement('p');
          sunsetP.textContent = `Sunset (UTC): ${sunset}`;
          sunTimesDiv.appendChild(sunriseP);
          sunTimesDiv.appendChild(sunsetP);
        })
        .catch(error => {
          console.error('Error fetching sunrise/sunset times:', error);
          const errorP = document.createElement('p');
          errorP.textContent = 'Sunrise/Sunset data not available.';
          sunTimesDiv.appendChild(errorP);
        });
    }
  }
  
  // Function to fetch sunrise/sunset times
  async function getSunsetForMountain(lat, lng) {
    try {
      let response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`
      );
      let data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sunrise/sunset times:', error);
      return {
        results: { sunrise: 'N/A', sunset: 'N/A' },
      };
    }
  }