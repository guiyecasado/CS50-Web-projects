function view_email(id) {
  console.log(id);
  fetch(`/emails/${id}/`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-detail-view').style.display = 'block';
      document.querySelector('#email-detail-view').innerHTML = `
        <ul class="list-group">
          <li class="list-group"><strong>From</strong> ${email.sender}</li>
          <li class="list-group">To: ${email.recipients}</li>
          <li class="list-group">Subject: ${email.subject}</li>
          <li class="list-group">Timestamp: ${email.timestamp}</li>
          <li class="list-group">Body: ${email.body}</li>
        </ul>`;

      // Check if read is FALSE and mark email as read
      if (!email.read) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

      const btn_arch = document.createElement('button');
      btn_arch.innerHTML = email.archived ? 'Unarchive' : 'Archive';
      btn_arch.className = email.archived ? 'btn btn-success' : 'btn btn-danger';

      btn_arch.addEventListener('click', function() {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
        .then(() => {
          load_mailbox('archive');
        });
      });
      document.querySelector('#email-detail-view').append(btn_arch);

      const btn_reply = document.createElement('button');
      btn_reply.innerHTML = "Reply";
      btn_reply.className = 'btn btn-info';
      btn_reply.addEventListener('click', function() {
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        let subject = email.subject;
        if (subject.split(' ', 1)[0] != "Re:") { // Added closing parenthesis here
          subject = "Re: " + email.subject;
        }

        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;

        document.querySelector('#email-detail-view').append(btn_reply); // Moved inside the if block
      });

      document.querySelector('#email-detail-view').append(btn_reply); // Moved outside the if block
    });
}
