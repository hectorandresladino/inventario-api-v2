package com.gestionpedidos.service;

import com.gestionpedidos.model.Pedido;
import com.gestionpedidos.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }
    
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }
    
    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    public Pedido update(Long id, Pedido pedidoDetails) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setCliente(pedidoDetails.getCliente());
        pedido.setProducto(pedidoDetails.getProducto());
        pedido.setCantidad(pedidoDetails.getCantidad());
        pedido.setPrecio(pedidoDetails.getPrecio());
        pedido.setEstado(pedidoDetails.getEstado());
        pedido.setFecha(pedidoDetails.getFecha());
        
        return pedidoRepository.save(pedido);
    }
    
    public void delete(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado con id: " + id);
        }
        pedidoRepository.deleteById(id);
    }
}
