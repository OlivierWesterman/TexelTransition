FROM nginx:alpine

# Create directory structure
RUN mkdir -p /usr/share/nginx/html/resources/Images

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Copy the NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]