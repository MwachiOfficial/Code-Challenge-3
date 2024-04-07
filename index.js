// Your code here
document.addEventListener('DOMContentLoaded', function() {
    const filmsList = document.getElementById('films');
    const posterImg = document.getElementById('poster');
    const titleDiv = document.getElementById('title');
    const runtimeDiv = document.getElementById('runtime');
    const filmInfoDiv = document.getElementById('film-info');
    const showtimeSpan = document.getElementById('showtime');
    const ticketNumSpan = document.getElementById('ticket-num');
    const buyTicketBtn = document.getElementById('buy-ticket');
    const deleteMovieBtn = document.getElementById('delete-movie');

    // Fetch and display movie details
    fetchMovieDetails(1);

    // Fetch and display movie list
    fetchMovieList();

    // Event listener for buying tickets
    buyTicketBtn.addEventListener('click', function() {
      // Implement buy ticket functionality here
      fetch("http://localhost:3000/films/1")
        .then(response => response.json())
        .then(movie => {
          if (movie.tickets_sold < movie.capacity) {
            const updatedTicketsSold = movie.tickets_sold + 1;
            fetch(`http://localhost:3000/films/1`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold })
            })
            .then(response => response.json())
            .then(updatedMovie => {
              fetchMovieDetails(updatedMovie.id);
            });
            fetch(`http://localhost:3000/tickets`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ film_id: "1", number_of_tickets: 1 })
            });
          }
        });
    });

    // Event listener for deleting a movie
    deleteMovieBtn.addEventListener('click', function() {
      // Implement delete movie functionality here
      fetch("http://localhost:3000/films/1", {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          fetchMovieList();
          fetchMovieDetails(1);
        }
      });
    });

    function fetchMovieDetails(movieId) {
      fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
          posterImg.src = movie.poster;
          titleDiv.textContent = movie.title;
          runtimeDiv.textContent = `${movie.runtime} minutes`;
          filmInfoDiv.textContent = movie.description;
          showtimeSpan.textContent = movie.showtime;
          const availableTickets = movie.capacity - movie.tickets_sold;
          ticketNumSpan.textContent = `${availableTickets} remaining tickets`;
          if (availableTickets === 0) {
            buyTicketBtn.textContent = "Sold Out";
            buyTicketBtn.disabled = true;
          }else {
            // Reset button if tickets are available
            buyTicketBtn.textContent = "Buy Ticket";
            buyTicketBtn.disabled = false;
          }
        });
    }

    function fetchMovieList() {
      fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
          filmsList.innerHTML = '';
          movies.forEach(movie => {
            const li = document.createElement('li');
            li.classList.add('film', 'item');
            li.textContent = movie.title;
            if (movie.tickets_sold === movie.capacity) {
              li.classList.add('sold-out');
            }
            filmsList.appendChild(li);
          });
        });
    }
  });