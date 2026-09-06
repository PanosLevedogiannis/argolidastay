/* Layout του πάνελ διαχείρισης. Παράγεται από το Payload — μην το αλλάζεις
   χειροκίνητα εκτός αν ξέρεις τι κάνεις. */
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

/*
 * Το φύλλο στυλ του ίδιου του Payload. ΧΩΡΙΣ ΑΥΤΟ το πάνελ εμφανίζεται ως
 * γυμνό HTML — φόρμες σε πλήρες πλάτος, χωρίς μενού, χωρίς διάταξη.
 * Πρέπει να φορτώνεται ΠΡΙΝ το custom.scss, ώστε οι δικές μας ρυθμίσεις
 * να το υπερισχύουν και όχι το αντίστροφο.
 */
import '@payloadcms/next/css'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
