"use client"

import * as React from 'react';
import { Button, Field, Input, Stack, Card, Text } from "@chakra-ui/react";
import { smartAccount } from '@/lib/usdc-aa';
import { IFormValues } from '@/lib/utils'
import { useForm } from "react-hook-form"
import { transferUSDC } from '@/lib/transfer-service'

export function AaUsdcTx() {
  const { register, handleSubmit,} = useForm<IFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    await transferUSDC(data.recipient, data.amount)
  })
  
  return (
    <div className="fixed top-4 right-4 bg-card rounded-lg border shadow p-3">
      <Stack gap="2" align="flex-start">
        <Card.Root maxW="lg">
          <Card.Header>
            <Card.Title>Transfer USDC</Card.Title>
            <Card.Description>
              Fill in the form below to transfer USDC
            </Card.Description>
          </Card.Header>
          <Card.Body>
          <Text textStyle="md">Smart Account is: {smartAccount.address}</Text>
          </Card.Body>
        </Card.Root>
        <Card.Root maxW="sm">
          <Card.Header>
            <Card.Title>Transfer USDC</Card.Title>
            <Card.Description>
              Fill in the form below to transfer USDC
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <form onSubmit={onSubmit}>
              <Stack gap="4" align="flex-start" maxW="sm">
                <Field.Root>
                  <Field.Label>Recipient</Field.Label>
                  <Input
                    {...register("recipient", { required: "Recipient address is required" })}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Amount</Field.Label>
                  <Input
                    {...register("amount", { required: "Amount is required" })}
                  />
                </Field.Root>
                <Button type="submit">Submit</Button>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>
      </Stack>
    </div>
  )
}