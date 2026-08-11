package com.example.salesheet.services;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetPageDTO;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.mappers.SpreadSheetMapper;
import com.example.salesheet.repositories.ProductRepository;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import com.example.salesheet.specifications.SpreadSheetSpecifications;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpreadsheetService {

    private final SpreadsheetRepository spreadsheetRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public SpreadSheetPageDTO list(UUID salespersonId, SpreadSheetStatus status, String name, boolean excludeDraft, Pageable pageable) {
        var listSpec = SpreadSheetSpecifications.buildSpec(salespersonId, status, name, excludeDraft);
        return spreadsheetRepository.findAllWithCounts(listSpec, salespersonId, pageable);
    }

    public SpreadSheetDTO create(SpreadSheetCreateDTO dto) {
        var user = userRepository.findById(dto.getSalespersonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salesperson not found"));

        var spreadSheet = new SpreadSheet();
        spreadSheet.setName(dto.getName());
        spreadSheet.setUser(user);

        spreadSheet = spreadsheetRepository.save(spreadSheet);
        log.info("Spreadsheet created: id={}, name={}, salespersonId={}", spreadSheet.getId(), spreadSheet.getName(), dto.getSalespersonId());
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    @Transactional(readOnly = true)
    public SpreadSheetDTO getById(Long id) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    public SpreadSheetDTO updateStatus(Long id, SpreadSheetStatus status) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        spreadSheet.setStatus(status);
        spreadSheet = spreadsheetRepository.save(spreadSheet);
        log.info("Spreadsheet status updated: id={}, status={}", id, status);
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    public void delete(Long id) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));
        spreadsheetRepository.delete(spreadSheet);
        log.info("Spreadsheet deleted: id={}", id);
    }

    public SpreadSheetDTO emit(Long id) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        if (spreadSheet.getUser() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Spreadsheet must have a salesperson assigned");
        }

        long productCount = productRepository.countBySpreadSheetId(id);
        if (productCount == 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Spreadsheet must have at least one product");
        }

        spreadSheet.setStatus(SpreadSheetStatus.ACTIVE);
        spreadSheet.setIssuedAt(LocalDateTime.now());
        spreadSheet = spreadsheetRepository.save(spreadSheet);
        log.info("Spreadsheet emitted: id={}, salespersonId={}, products={}", id, spreadSheet.getUser().getId(), productCount);
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    public SpreadSheetDTO updateSalesperson(Long id, UUID salespersonId) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));
        var user = userRepository.findById(salespersonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salesperson not found"));
        spreadSheet.setUser(user);
        spreadSheet = spreadsheetRepository.save(spreadSheet);
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    @Transactional(readOnly = true)
    public SpreadSheetDTO getByIdForUser(Long id, UUID userId) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        if (!spreadSheet.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        if (spreadSheet.getStatus() == SpreadSheetStatus.DRAFT) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found");
        }

        return SpreadSheetMapper.toDTO(spreadSheet);
    }
}
