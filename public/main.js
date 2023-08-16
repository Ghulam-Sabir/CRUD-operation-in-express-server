function createPost(event) {
    event.preventDefault();
    let postTitle = document.querySelector("#title");
    let postText = document.querySelector("#text");

    let timestamp = new Date().toISOString();

    axios.post(`/api/v1/post`, {
        title: postTitle.value,
        text: postText.value,
        timestamp: timestamp
      })
      .then(function (response) {
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Post Added',
          timer: 1000,
          showConfirmButton: false
        });
        renderPost();
      })
      .catch(function (error) {
        console.log("Error creating post:", error.data);
        document.querySelector(".result").innerHTML = "Error in post submission";
      });

    postTitle.value = "";
    postText.value = "";
  }

  function renderPost() {
    axios.get(`/api/v1/posts`)
      .then(function (response) {
        let posts = response.data;
        let postContainer = document.querySelector(".result");
        postContainer.innerHTML = "";

        posts.forEach(function (post) {
          let postElement = document.createElement("div");
          postElement.className = "post";

          let time = document.createElement("p");
          time.className = "regards center";
          time.style.fontSize = "0.7em";
          time.textContent = moment(post.timestamp).fromNow();
          postElement.appendChild(time);

          let titleElement = document.createElement("h2");
          titleElement.textContent = post.title;
          titleElement.className = "scroll";
          postElement.appendChild(titleElement);

          let textElement = document.createElement("p");
          textElement.className = "scroll";
          textElement.textContent = post.text;
          postElement.appendChild(textElement);
          postElement.dataset.postId = post.id;

          let row = document.createElement("div");
          row.className = "space-around";

          let regards = document.createElement("p");
          regards.className = "regards";
          regards.textContent = "Regards! Ghualm sabir";
          row.appendChild(regards);

          // Add edit button
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", function (event) {
            event.preventDefault();
            const postId = this.parentNode.parentNode.dataset.postId;
            editPost(postId);
          });
          row.appendChild(editButton);

          // Add delete button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function (event) {
            event.preventDefault();
            const postId = this.parentNode.parentNode.dataset.postId;
            deletePost(postId);
          });
          row.appendChild(deleteButton);

          postElement.appendChild(row);

          // Append the post element to the postContainer
          postContainer.appendChild(postElement);
        });
      })
      .catch(function (error) {
        console.log(error.data);
      });
  }

  // delete post function and edit post function should be defined here
  // ...
  function editPost(postId) {
  //   // Implement the functionality to edit a post
    const newTitle = prompt("Enter new title for the post:");
    const newText = prompt("Enter new text for the post:");

    if (newTitle && newText) {
      axios.put(`/api/v1/post/${postId}`, {
        title: newTitle,
        text: newText
      })
      .then(function (response) {
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Post Edited',
          timer: 1000,
          showConfirmButton: false
        });
        renderPost();
      })
      .catch(function (error) {
        console.log("Error editing post:", error.data);
        document.querySelector(".result").innerHTML = "Error in post editing";
      });
    }
  }
  
  function deletePost(postId) {
    // Implement the functionality to delete a post
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to delete this post?',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/v1/post/${postId}`)
          .then(function (response) {
            console.log(response.data);
            Swal.fire({
              icon: 'success',
              title: 'Post Deleted',
              timer: 1000,
              showConfirmButton: false
            });
            renderPost();
          })
          .catch(function (error) {
            console.log("Error deleting post:", error.data);
            document.querySelector(".result").innerHTML = "Error in post deletion";
          });
      }
    });
  }


  // Refresh page
  document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") {
      renderPost();
    }
  });


// ... Previous JavaScript code ...

// Edit post function with Swal input fields
function editPost(postId) {
  axios.get(`/api/v1/post/${postId}`)
    .then(response => {
      const post = response.data;
      Swal.fire({
        title: 'Edit Post',
        html: `
          <input type="text" id="editTitle" class="swal2-input" placeholder="Post Title"  required>
          <textarea id="editText" class="swal2-input text" placeholder="Post Text" value="enter a new text" required></textarea>
        `,
        showCancelButton: true,
        cancelButtonColor: "#212121",
        confirmButtonText: 'Edit',
        confirmButtonColor: "#212121",
        preConfirm: () => {
          // Get the updated title and text
          const editedTitle = document.getElementById('editTitle').value;
          const editedText = document.getElementById('editText').value;

          if (!editedTitle.trim() || !editedText.trim()) {
            Swal.showValidationMessage('Title and text are required');
            return false;
          }

          // Make the API call to update the post
          return axios.put(`/api/v1/post/${postId}`, {
            title: editedTitle,
            text: editedText
          })
            .then(response => {
              console.log(response.data);
              Swal.fire({
                icon: 'success',
                title: 'Post Updated',
                timer: 1000,
                showConfirmButton: false
              });
              // If the post was updated successfully, re-render the posts
              renderPost();
            })
            .catch(error => {
              console.log(error.data);
              Swal.fire({
                icon: 'error',
                title: 'Failed to update post',
                timer: 1000,
                showConfirmButton: false
              });
            });
        }
      });
    })
    .catch(error => {
      console.log(error.data);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch post',
        timer: 1000,
        showConfirmButton: false
      });
    });
}