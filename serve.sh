#!/usr/bin/env bash
RUBY_VERSION=3.0.0-dev
GEM_HOME=~/.gem "$(rbenv root)"/versions/${RUBY_VERSION}/bin/bundle install
GEM_HOME=~/.gem "$(rbenv root)"/versions/${RUBY_VERSION}/bin/bundler exec jekyll serve
