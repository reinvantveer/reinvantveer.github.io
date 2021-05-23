---
title: A pseudo-random number generator for the Sega Megadrive in Rust
layout: post
published: false
---

ˋˋˋ
// internal
u16 randbase;


void setRandomSeed(u16 seed)
{
    // xor it with a random value to avoid 0 value
    randbase = seed ^ 0xD94B;
}

u16 random()
{
    randbase ^= (randbase >> 1) ^ GET_HVCOUNTER;
    randbase ^= (randbase << 1);

    return randbase;
}
ˋˋˋ
