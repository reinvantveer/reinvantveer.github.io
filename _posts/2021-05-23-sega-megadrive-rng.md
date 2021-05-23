---
title: A pseudo-random number generator for the Sega Megadrive in Rust
layout: post
published: false
---

Recently I collaborated in an initiative to enable usage of the Rust language programming for the Sega Megadrive. As a Motorola 68000 enthusiast, I 
spotted this initiative by Ricky Taylor and first of all wanted to reproduce the results they reproduced using a patched LLVM and patched Rust compiler.
I must admit I have not contributed a single line of Rust code yet, however I hope this will change soon.

Ricky managed to retarget the Rust compiler not only for Motorola 68000 backends, but also to incorporate the memory map and assembler code to target the 
Sega Megadrive specifically. This platform is interesting for a great number of reasons: for retro-gaming, modding through custom hardware in cartridge 
format, a very interesting sound chip, good graphics capabilities etcetera, all very well documented all over the internet.

I'm quite convinced that enabling Rust for this platform can spur new game development initiatives a great deal. 

So, after configuring reproducible builds of .md-extension binaries for the Megadrive (not to be confused with MarkDown files, of course), I decided on 
trying my hand on some Rust programming for the Sega Megadrive myself.

Now, it should be noted that writing for the Megadrive falls under the categories of 'embedded' development (having no operating system of note) without
standard library availability. The standard library would get into trouble very, very quickly without having any notion of, say, a file system. No such
thing exists on the Megadrive by default. You could say that any game (or program) loaded from a cartridge _is_ an operating system in minimalistic form.
Since I have very, very little experience in embedded development (some Arduino programming, some GCC compiler compilation for m68k) so this should be 
interesting. 

One particular functionality I would very much like to have access to is a random number generator in some form or other. I've always had an interest in 
Roguelikes/Roguelites for games, because the replayability of Roguelikes is greatly enhanced through the unexpected nature of the randomness. So having 
access to something approaching a (pseudo-)random number generator is pretty high on my list.  

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
