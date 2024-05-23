package me.escoffier.quarkus.summarizer.rag;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.BgeSmallEnQuantizedEmbeddingModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import io.quarkiverse.langchain4j.redis.RedisEmbeddingStore;
import jakarta.inject.Singleton;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Singleton
public class Retriever implements Supplier<RetrievalAugmentor> {

    private final RetrievalAugmentor augmentor;

    Retriever(EmbeddingStore<TextSegment> store, EmbeddingModel embedding) {
        EmbeddingStoreContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(embedding)
                .embeddingStore(store)
                .maxResults(3)
                .build();
        augmentor = DefaultRetrievalAugmentor
                .builder()
                .contentRetriever(retriever)
                .build();
    }

    @Override
    public RetrievalAugmentor get() {
        return augmentor;
    }


}
