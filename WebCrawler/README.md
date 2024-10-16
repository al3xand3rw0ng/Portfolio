All project code is written in Python.

To implement our web crawler, we first implemented a GET request for the login page. The server then sent back its 
response, from which we were able to parse through it and find the csrfmiddlewaretoken. We used the token in combination
with our username and password in order to login. We constructed a POST request to the website in order to send our 
information along with the host and the path. After logging in, we make sure to send cookies (csrf_token and sessionid)
along with every request. We parse through the html files and once we find a valid link with '/fakebook/' in it, we add
it to our list of links to visit, making sure that our crawler traverses through all the pages until it finds all 5 
secret flags. Once it finds and print out the 5 secret flags, the socket closes and exits the program.

The main challenged we faced was making our code faster. Upon initially completing our code, we realized that it ran 
very slow. This was due to our heavy use of nested for loops. To resolve this, we simplified our code to remove some of
these nested loops, which helped to improve the runtime performance. 

One property/feature of our program we believe is good is that we separated the various program specifications provided
by the assignment description into various functions. This made it much easier to debug the code since pinpointing where
any issues we encountered was made much easier through this. If a bug was encountered, we would review the corresponding
function which carried out this task.   

To test our code, we used print statements–which have since been deleted for submission purposes. Such print statements
implemented were used to review contents of the webpage. 