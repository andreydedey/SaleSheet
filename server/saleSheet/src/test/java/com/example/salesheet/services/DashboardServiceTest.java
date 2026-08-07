package com.example.salesheet.services;

import com.example.salesheet.dto.SalespersonDTO;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock UserRepository userRepository;
    @Mock SpreadsheetRepository spreadsheetRepository;
    @Mock ProductRepository productRepository;
    @InjectMocks DashboardService dashboardService;

    @Test
    void getStats_returnsCorrectCounts() {
        when(userRepository.countByRole(Role.SALESPERSON)).thenReturn(5L);
        when(spreadsheetRepository.countByStatus(SpreadSheetStatus.ACTIVE)).thenReturn(3L);
        when(productRepository.sumSoldPrices()).thenReturn(150000L);

        var stats = dashboardService.getStats();

        assertThat(stats.getTotalSalespersons()).isEqualTo(5L);
        assertThat(stats.getActiveSpreadsheets()).isEqualTo(3L);
        assertThat(stats.getTotalSold()).isEqualTo(150000L);
    }

    @Test
    void listSalespersons_returnsPage() {
        var pageable = PageRequest.of(0, 10);
        var salesperson = new SalespersonDTO(UUID.randomUUID(), "Ana", "ana@email.com", 50000L, 3);
        var page = new PageImpl<>(List.of(salesperson), pageable, 1);
        when(userRepository.findAllSalespersonStats(pageable)).thenReturn(page);

        var result = dashboardService.listSalespersons(pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Ana");
    }
}
