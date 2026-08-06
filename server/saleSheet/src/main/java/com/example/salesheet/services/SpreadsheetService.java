package com.example.salesheet.services;

import com.example.salesheet.dto.SpreadSheetCreateDTO;
import com.example.salesheet.dto.SpreadSheetDTO;
import com.example.salesheet.dto.SpreadSheetListDTO;
import com.example.salesheet.entities.SpreadSheet;
import com.example.salesheet.enums.SpreadSheetStatus;
import com.example.salesheet.mappers.SpreadSheetMapper;
import com.example.salesheet.repositories.SpreadsheetRepository;
import com.example.salesheet.repositories.UserRepository;
import com.example.salesheet.specifications.SpreadSheetSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpreadsheetService {

    private final SpreadsheetRepository spreadsheetRepository;
    private final UserRepository userRepository;

    public Page<SpreadSheetListDTO> list(UUID salespersonId, SpreadSheetStatus status, String name, Pageable pageable) {
        var spec = SpreadSheetSpecifications.buildSpec(salespersonId, status, name);
        return spreadsheetRepository.findAllAsListDTO(spec, pageable);
    }

    public SpreadSheetDTO create(SpreadSheetCreateDTO dto) {
        var user = userRepository.findById(dto.getSalespersonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salesperson not found"));

        var spreadSheet = new SpreadSheet();
        spreadSheet.setName(dto.getName());
        spreadSheet.setUser(user);

        spreadSheet = spreadsheetRepository.save(spreadSheet);
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

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
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

    public void delete(Long id) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));
        spreadsheetRepository.delete(spreadSheet);
    }

    public SpreadSheetDTO emit(Long id) {
        var spreadSheet = spreadsheetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spreadsheet not found"));

        spreadSheet.setStatus(SpreadSheetStatus.ACTIVE);
        spreadSheet.setIssuedAt(LocalDateTime.now());
        spreadSheet = spreadsheetRepository.save(spreadSheet);
        return SpreadSheetMapper.toDTO(spreadSheet);
    }

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
