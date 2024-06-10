package com.swit.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {
    @Value("${com.swit.upload.path}")
    private String uploadPath;

    @PostConstruct
    public void init(){
        File tempFolder = new File(uploadPath);
        if(tempFolder.exists() ==false){
            tempFolder.mkdir();
        }
        uploadPath = tempFolder.getAbsolutePath();
        log.info("-------------------------------------------");
        log.info(uploadPath);
    }

    public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException{
        if(files == null || files.size() ==0){
            return List.of();
        }
        List<String> uploadNames = new ArrayList<>();
        for(MultipartFile multipartFile :files){
            String savedName = UUID.randomUUID().toString()+ "_"+multipartFile.getOriginalFilename();
            Path savedPath = Paths.get(uploadPath, savedName);
            try{
                Files.copy(multipartFile.getInputStream(), savedPath);
                uploadNames.add(savedName);
            }catch(IOException e){
                throw new RuntimeException(e.getMessage());
            }
        }
        return uploadNames;
    }    
    //파일 데이터를 읽어서 Resource 타입으로 반환
    public ResponseEntity<Resource> getFile(String fileName){
        Resource resource = new FileSystemResource(uploadPath + File.separator+fileName);
        if(!resource.isReadable()){
            resource = new FileSystemResource(uploadPath+File.separator+"rose.png");
        }
        HttpHeaders headers = new HttpHeaders();
        try{
            headers.add("Content-type", Files.probeContentType(resource.getFile().toPath()));
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    public void deleteFiles(List<String> fileNames){
        if(fileNames == null || fileNames.size() ==0){
            return;
        }
        fileNames.forEach(fileName ->{
            Path filePath = Paths.get(uploadPath, fileName);
            try{
                Files.deleteIfExists(filePath);
            }catch(IOException e){
                throw new RuntimeException(e.getMessage());
            }
        });
    }

    public List<String> modifyFiles(List<MultipartFile> newFiles, List<String> oldFileNames) throws RuntimeException {
        // 기존 파일 삭제
        deleteFiles(oldFileNames);
        
        log.info("-------------------------------------------");
        log.info(newFiles);
        // 새로운 파일 저장
        return saveFiles(newFiles);
    }
}
