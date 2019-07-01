FROM python:3.7.3-alpine3.9
RUN adduser user -D 
WORKDIR /home/user/app
RUN chown user:user /home/user/app
USER user
COPY dist .
EXPOSE 8000
CMD [ "python3","-m","http.server","8000" ]