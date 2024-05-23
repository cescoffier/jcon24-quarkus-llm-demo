package me.escoffier.quarkus.summarizer.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import io.quarkus.logging.Log;
import io.quarkus.runtime.Startup;

import java.io.File;
import java.util.List;

import static dev.langchain4j.data.document.splitter.DocumentSplitters.recursive;

@Startup
public class Ingestor {


    public Ingestor(EmbeddingStore<TextSegment> store, EmbeddingModel embedding) {
        Log.infof("Ingesting documents...");
        List<Document> documents = FileSystemDocumentLoader.loadDocuments(new File("documents").getPath());
        EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
                .embeddingStore(store)
                .embeddingModel(embedding)
                .documentSplitter(recursive(500, 0))
                .build();
        ingestor.ingest(documents);
        Log.infof("Ingested %d documents.", documents.size());
    }


}
