package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/quic-go/quic-go"
	"io"
)

func castedClient() error {
	tlsConf := &tls.Config{
		InsecureSkipVerify: true,
		NextProtos:         []string{"quic-echo-example"},
	}
	for j := 1; j < 10; j++ {
		conn, err := quic.DialAddr(context.Background(), addr, tlsConf, nil)
		if err != nil {
			return err
		}
		defer conn.CloseWithError(0, "")

		stream, err := conn.OpenStreamSync(context.Background())
		if err != nil {
			return err
		}
		defer stream.Close()

		message = fmt.Sprintf("%s%d", orgMessage, j)
		fmt.Printf("Client: Sending '%s'\n", message)
		if _, err := stream.Write([]byte(message)); err != nil {
			return err
		}

		buf := make([]byte, len(message))
		if _, err := io.ReadFull(stream, buf); err != nil {
			return err
		}
		fmt.Printf("Client: Got '%s'\n", buf)
	}
	return nil
}

func castedClientTest(no_of_reqs int) error {
	tlsConf := &tls.Config{
		InsecureSkipVerify: true,
		NextProtos:         []string{"quic-echo-example"},
	}
	for j := 1; j < no_of_reqs; j++ {
		conn, err := quic.DialAddr(context.Background(), addr, tlsConf, nil)
		if err != nil {
			return err
		}
		defer conn.CloseWithError(0, "")

		stream, err := conn.OpenStreamSync(context.Background())
		if err != nil {
			return err
		}
		defer stream.Close()

		message = fmt.Sprintf("%s%d", orgMessage, j)
		fmt.Printf("Client: Sending '%s'\n", message)
		if _, err := stream.Write([]byte(message)); err != nil {
			return err
		}

		buf := make([]byte, len(message))
		if _, err := io.ReadFull(stream, buf); err != nil {
			return err
		}
		fmt.Printf("Client: Got '%s'\n", buf)
	}
	return nil
}
