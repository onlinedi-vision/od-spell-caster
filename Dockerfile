FROM golang AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /od-spell-caster .

FROM scratch
COPY --from=build /od-spell-caster /od-spell-caster

# bandaid fix
# we'll have to fix this later...
# COPY ./fullchain.pem fullchain.pem
# COPY ./privkey.pem privkey.pem
# COPY ./ash.yaml ./ash.yaml
CMD ["/od-spell-caster"]
