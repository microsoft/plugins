---
title: Zero to agent, live in Copilot
description: Scaffold, provision, and open a Copilot agent from an empty folder.
draft: true
sidebar:
  order: 1
  badge:
    text: Draft
    variant: caution
---

Goal: empty folder to live Copilot agent.

Aha: you can chat with your own agent in under a minute.

At a glance: `wiqd agent create` → `wiqd agent provision --env dev` → `wiqd agent open`.

Prereqs:
- wiqd installed and signed in
- permission to provision to a dev environment

Steps:
1. Run `wiqd agent create`.
2. Run `wiqd agent provision --env dev`.
3. Run `wiqd agent open`.

Verify: the agent opens in Copilot and answers in chat.

Next: [Give your agent real powers](/cookbooks/add-api-action)
