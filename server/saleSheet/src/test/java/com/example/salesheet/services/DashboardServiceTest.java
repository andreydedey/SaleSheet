package com.example.salesheet.services;

import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock UserRepository userRepository;
    @Mock SpreadsheetRepository spreadsheetRepository;
    @InjectMocks DashboardService dashboardService;

    @Test
    void getStats_returnsCorrectCounts() {
        when(userRepository.countByRole(Role.SALESPERSON)).thenReturn(5L);
        when(spreadsheetRepository.countByStatus(SpreadSheetStatus.ACTIVE)).thenReturn(3L);

        var stats = dashboardService.getStats();

        assertThat(stats.getTotalSalespersons()).isEqualTo(5L);
        assertThat(stats.getActiveSpreadsheets()).isEqualTo(3L);
    }
}
