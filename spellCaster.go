package main

import (
	"context"
	"github.com/quic-go/quic-go"
	"io"
)

func spellCaster() error {
	listener, err := quic.ListenAddr(addr, generateTLSConfig(), nil)
	if err != nil {
		return err
	}
	defer listener.Close()
	for j := 0; j < 10; j++ {
		conn, err := listener.Accept(context.Background())
		if err != nil {
			return err
		}

		go func() {
			stream, err := conn.AcceptStream(context.Background())

			if err != nil {
				panic(err)
			}
			defer stream.Close()

			_, _ = io.Copy(loggingWriter{stream}, stream)
		}()
	}
	return nil
}

func spellCasterTest(no_of_reqs int) error {
	listener, err := quic.ListenAddr(addr, generateTLSConfig(), nil)
	if err != nil {
		return err
	}
	defer listener.Close()
	for j := 0; j < no_of_reqs; j++ {
		conn, err := listener.Accept(context.Background())
		if err != nil {
			return err
		}

		go func() {
			stream, err := conn.AcceptStream(context.Background())

			if err != nil {
				panic(err)
			}
			defer stream.Close()

			_, _ = io.Copy(loggingWriter{stream}, stream)
		}()
	}
	return nil
}
