FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
#运行 Nginx，并在前台运行
CMD ["nginx", "-g", "daemon off;"]