package me.escoffier.quarkus.summarizer;


import io.quarkus.logging.Log;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.core.Response;
import me.escoffier.quarkus.summarizer.model.Claim;
import me.escoffier.quarkus.summarizer.service.ClaimService;
import org.jboss.resteasy.reactive.RestForm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.List;

@RestController()
public class ClaimController {

    final ClaimService claims;

    public ClaimController(ClaimService claims) {
        this.claims = claims;
    }
    
    @GetMapping("/claims")
    public List<Claim> getClaims() {
        return claims.getClaims();
    }

    @GetMapping("/claims/{id}")
    public Claim getClaim(long id) {
        return claims.getById(id);
    }

    @PostMapping(path = "/claims", consumes = "multipart/form-data")
    public ResponseEntity<Void> create(@RestForm File file) throws IOException {
        var content = Files.readString(file.toPath());
        Log.info("Processing claim... ");
        try {
            var processed = claims.process(content);
            Log.infof("Processed claim %d", processed.id);
            return ResponseEntity.created(new URI("/claims/" + processed.id)).build();
        }  catch (Exception e) {
            Log.errorf("Unable to process claim", e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }
}
