# <img src="./src/icons/datamodel.svg"> Promptry

## <img src="./src/icons/book.svg"> Introduction

This site hosts articles and demos of end-to-end projects for analytics, web dev, machine learning, and more. The objective is to share a knowledge-seeking journey into becoming better data-driven developers and/or analysts, and hopefully this can have more participants in the future and become a shared endeavour. The reason for the name `Promptry` is because every day we are more and more surrounded by prompt-driven A.I. and this site reflects it in its content and philosophy.

## <img src="./src/icons/prompt2.svg"> The Prompt Format

In order to improve the resourcefulness of this site for humans and A.I., all content is written as a conversation, specifically, as a set of Question and Answer interactions that can be easily embedded and stored in a database and queried as context for a Large Language Model. As of June 2023, most open source embedding models have smaller windows that can capture conversational prompts with good performance, even though models with larger windows and more dimensions are good at embedding larger documents, most of the interactions with A.I. are still on a prompt-to-prompt basis. This format is not very different from traditional human-to-human interactions found in internet forums, the only difference is that the focus changes to support the way we retrieve information now, however, references to long form documents and publications are still encouraged.

## <img src="./src/icons/rocket.svg"> Workflow

Right now, this site uses [Astro](https://astro.build/)'s content collections for organizing blogs, and React for creating more complex components. This enables using Markdown as a document format and HTMl+CSS+JS for creating data visualizations, user interfaces, etc. Instead of the traditional .md file extension, we can use [MDX](https://mdxjs.com/) for easier integration of custom components directly on the markdown document to speed up to overall creation process.