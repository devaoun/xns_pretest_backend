-- CreateTable
CREATE TABLE `Votes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `quoteId` INTEGER NOT NULL,

    UNIQUE INDEX `Votes_userId_quoteId_key`(`userId`, `quoteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Votes` ADD CONSTRAINT `Votes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Votes` ADD CONSTRAINT `Votes_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quotes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
