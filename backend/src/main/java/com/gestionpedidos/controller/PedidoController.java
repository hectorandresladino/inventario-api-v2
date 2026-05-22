package com.gestionpedidos.controller;

import com.gestionpedidos.model.Pedido;
import com.gestionpedidos.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @GetMapping
    public List<Pedido> getAllPedidos() {
        return pedidoService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) {
        return pedidoService.findById(id)
                .map(pedido -> ResponseEntity.ok().body(pedido))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Pedido createPedido(@RequestBody Pedido pedido) {
        return pedidoService.save(pedido);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updatePedido(@PathVariable Long id, @RequestBody Pedido pedidoDetails) {
        try {
            Pedido updatedPedido = pedidoService.update(id, pedidoDetails);
            return ResponseEntity.ok(updatedPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        try {
            pedidoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
