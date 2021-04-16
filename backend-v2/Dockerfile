FROM hayd/ubuntu-deno

WORKDIR /home/app

COPY deps.ts .
RUN deno cache deps.ts
RUN deno install -qAf --unstable https://deno.land/x/denon/denon.ts

ADD . .
RUN deno cache main.ts

EXPOSE 8500