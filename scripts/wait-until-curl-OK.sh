#!/bin/bash

until curl -i localhost:3001/health | grep "200 OK"
  do
    sleep 10
  done

until curl -i localhost:3000 | grep "200 OK"
  do
    sleep 10
  done