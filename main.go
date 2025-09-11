package main

import (
	"log"
	"os"
	"strconv"
)

const addr = "0.0.0.0:4242"
const orgMessage = "foobar"

var message = "foobar"

func main() {

	args := os.Args[1:]
	if len(args) > 0 && args[0] == "test" {
		var noOfReqs int
		var err error
		if len(args) > 1 {
			interim, err := strconv.ParseInt(args[1], 10, 0)
			noOfReqs = int(interim)
			if err != nil {
				panic(err)
			}
		} else {
			noOfReqs = 10
		}

		go func() {
			log.Fatal(spellCasterTest(noOfReqs))
		}()

		err = castedClientTest(noOfReqs)
		if err != nil {
			panic(err)
		}

		return
	}

	go func() {
		log.Fatal(spellCaster())
	}()

	err := castedClient()
	if err != nil {
		panic(err)
	}
}
