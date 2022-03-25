#blueprint for each dependencies, etc

FROM postgres
#where it is on dockerhub image
WORKDIR 
#create a path where it can copy into docker files - can add bash flags ex chmod
COPY * *
#from local files
RUN
# can have multiple run (ex npm install)
CMD
# can only have one - npm start // closes off docker process and starts app

# Build an image starting with the Python 3.7 image.
# Set the working directory to /code.
# Set environment variables used by the flask command.
# Install gcc and other dependencies
# Copy requirements.txt and install the Python dependencies.
# Add metadata to the image to describe that the container is listening on port 5000
# Copy the current directory . in the project to the workdir . in the image.
# Set the default command for the container to flask run.