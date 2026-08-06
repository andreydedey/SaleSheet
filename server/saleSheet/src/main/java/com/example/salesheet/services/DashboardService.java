package com.example.salesheet.services;

import com.example.salesheet.dto.DashboardDTO;
import com.example.salesheet.dto.SalespersonDTO;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final SpreadsheetRepository spreadsheetRepository;

    public DashboardDTO getStats() {
        long totalSalespersons = userRepository.countByRole(Role.SALESPERSON);
        long activeSpreadsheets = spreadsheetRepository.countByStatus(SpreadSheetStatus.ACTIVE);
        return new DashboardDTO(totalSalespersons, 0, activeSpreadsheets);
    }

    public Page<SalespersonDTO> listSalespersons(Pageable pageable) {
        return userRepository.findAllSalespersonStats(pageable);
    }
}
