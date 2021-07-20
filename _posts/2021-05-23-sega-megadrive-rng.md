---
title: A pseudo-random number generator for the Sega Megadrive in Rust
layout: post
published: false
---

## Rust for the Sega Megadrive
Recently I collaborated in an initiative to enable usage of the [Rust language programming for the Sega Megadrive]
(https://github.com/ricky26/rust-mega-drive). Ricky managed to retarget the Rust compiler not only for Motorola 68000 backends, but also to incorporate 
the memory map and assembler code to target the Sega Megadrive specifically. I'm quite convinced that enabling Rust for this platform can spur new game 
development initiatives a great deal. This platform is interesting for a great number of reasons: for retro-gaming, modding through custom hardware in 
cartridge format, a very interesting sound chip, good graphics capabilities etcetera, all very well documented all over the internet.

As a Motorola 68000 enthusiast, I spotted this initiative and first of all wanted to reproduce the results they achieved from a patched LLVM, a patched 
Rust compiler and an API to the Megadrive hardware. My contribution was mainly in putting together two Dockerfiles and ironing out the few missing pieces 
of information from the build docs. I must admit I have not contributed a single line of Rust code yet, however I hope this will change soon. 

## Embedded Rust development
Now, it should be noted that writing for the Megadrive falls under the categories of 'embedded' development. The Sega megadrive has no operating system 
of note, I even wonder if there is anything on the Megadrive that does any software boot, but I could be mistaken. In any case, we can forget about 
availability of a Rust standard library. The standard library would get into trouble very, very quickly without having any notion of, say, a file system 
for example. No such thing exists on the Megadrive by default. You could say that any game (or program) loaded from a cartridge _is_ an operating system 
in minimalistic form. Since I have very, very little experience in embedded development (some Arduino programming, some GCC compiler compilation for 
m68k) so this should be interesting. 

## Random in Rust without a standard lib
So, after configuring reproducible builds of .md-extension binaries for the Megadrive (not to be confused with MarkDown files, of course), I decided on 
trying my hand on some Rust programming for the Sega Megadrive myself. One particular functionality I would very much like to have access to is a 
random number generator in some form or other. I've always had an interest in Roguelikes/Roguelites for games, because the replayability of Roguelikes is 
greatly enhanced through the unexpected nature of the randomness. So having access to something approaching a (pseudo-)random number generator is pretty 
high on my list.  

The first option would be simply to use the [Rust ˋrandˋ crate](https://crates.io/crates/rand) - one of the most downloaded crates. This was a little 
surprising to me - what explains ˋrandˋs popularity? First, I tried just adding the crate, but the default set of features requires presence of the 
standard lib. However, looking at the categories of the crate, it lists ˋno_stdˋ as an option. However, disabling _all_ features using 
ˋˋˋ
[dependencies]
rand = { version = "0.8.3", default-features = false }
ˋˋˋ
disables so much functionality that there isn't access to a ˋrandomˋ function anymore: you'd have to implement this from traits yourself. Then someone 
pointed me to 
ˋˋˋ
[dependencies]
rand = { version = "0.8.3", features = ["small_rng"] }
ˋˋˋ
which should enable a minimalistic API to pseudo-random number generation. 



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
